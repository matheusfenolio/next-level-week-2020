import {Request, Response} from 'express';
import knex from '../database/connection';
const ip = require('ip');

class PointsController{

    async index (req: Request, res: Response) {
        const { city, uf, items } = req.query;

        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await knex('points')
                                .join('point_items', 'points.id', '=', 'point_items.point_id')
                                .whereIn("point_items.item_id", parsedItems)
                                .where('city', String(city))
                                .where('uf', String(uf))
                                .distinct()
                                .select('points.*');

        points.map(point => { point.image = `http://${ip.address()}:3333/uploads/pointsImage/${point.image}`});

        return res.status(200).json(points);
    }

    async show (req: Request, res: Response) {
        const { id } = req.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return res.status(400).json({ message: 'Point not found'});
        }

        point.image = `http://${ip.address()}:3333/uploads/pointsImage/${point.image}`

        const items = await knex('items')
        .join('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id)
        .select('items.title', 'items.image');

        items.map(item => { item.image = `http://${ip.address()}:3333/uploads/${item.image}`});

        return res.status(200).json({
            point,
            items
        });
    }

    async create (req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;
    
        const trx = await knex.transaction();
    
        const point = {
            image: req.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        console.log(point);

        const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0];
    
        const pointItems = items.trim().split(',').map((item_id: Number) => {
            return {
                point_id,
                item_id,
            }
        })
    
        await trx('point_items').insert(pointItems);

        trx.commit();

        return res.status(200).json({
            point_id,
            ...point,
        });
    }
}

export default PointsController;