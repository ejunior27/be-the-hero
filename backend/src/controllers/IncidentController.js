const connection = require('../database/connection')

module.exports = {
    async index (request, response) {
        //paginação
        const{page = 1} = request.query;

        const [count] = await connection('incidents').count(); //conta quantos registros existem (variavel entre colchetes pq o resultado é um array, poderia ser count[0])
        
        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5) //paginação
            .offset((page - 1) * 5)//qual registro ele vai iniciar o select (0,5,10...)
            .select(['incidents.*', 
                'ongs.name', 
                'ongs.email', 
                'ongs.whatsapp', 
                'ongs.city', 
                'ongs.uf'
            ]);            
        
        response.header('X-Total-Count', count['count(*)']); //retornando o total de registros no header da resposta

        return response.json(incidents);
    },

    async create (request, response) {        
        const {title, description, value} = request.body;
        
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        })

        return response.json({id})
    },

    async delete (request, response){
        const{id} = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id) //filtro
            .select('ong_id') //coluna que será trazida
            .first(); //apenas o primeiro registro

        if(incident.ong_id !== ong_id){
            return response.status(401).json({error: 'Operation not permitted'});
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
    }
}