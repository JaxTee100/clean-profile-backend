import { Pool } from 'pg';
import dotenv from 'dotenv';
import { ResourceNotFoundError } from '../../utils/CustomErrors';
dotenv.config();

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const ProjectDAO = {
    async create(project_name: string, category: string, description: string, technologies: string[], link: string) {
        const result = await db.query(
            'INSERT INTO project (project_name, category, description, technologies, link) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [project_name, category, description, technologies, link]
        );
        return result.rows[0];
    },

    async findAll(limit:number, offset:number) {
        const result = await db.query('SELECT * FROM project ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    //avoid using business logic here
        return result.rows;
    },

    async findAllForAdmin() {
        const result = await db.query('SELECT * FROM project ORDER BY created_at DESC');
        return result.rows;
    },
    async getTotal() {
        const result = await db.query('SELECT COUNT(*) FROM project');
        return parseInt(result.rows[0].count, 10);

    },

    async findById(id: number) {
        const result = await db.query('SELECT * FROM project WHERE id = $1', [id]);
        if(!result.rows[0]){
            console.log('cannot fetch result')
        }
        return result.rows[0];
    },



    async update(
        id: number,
        project_name: string,
        category: string,
        description: string,
        technologies: string[],
        link: string
    ) {
        const result = await db.query(
            `UPDATE project
     SET project_name = $1,
         category = $2,
         description = $3,
         technologies = $4,
         link = $5
     WHERE id = $6
     RETURNING id, project_name, category, description, technologies, link, created_at, updated_at`,
            [project_name, category, description, technologies, link, id]
        );

        console.log('Update result:', result.rows[0]);
        return result.rows;
    },

    async delete(id: number) {
        const result = await db.query(
            'DELETE FROM project WHERE id = $1 RETURNING id, project_name',
            [id]
        );


        console.log('Delete result:', result.rows[0]);
        return result.rows; // You can return the deleted project's info
    }

};

export default ProjectDAO;
