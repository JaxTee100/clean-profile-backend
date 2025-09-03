"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isProduction = process.env.NODE_ENV === 'production';
const db = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false, // 🔑
});
db.connect()
    .then(client => {
    console.log("✅ Database connected successfully");
    client.release(); // release the client back to the pool
})
    .catch(err => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // exit the app if DB connection fails
});
const ProjectDAO = {
    create(project_name, category, description, technologies, link) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db.query('INSERT INTO project (project_name, category, description, technologies, link) VALUES ($1, $2, $3, $4, $5) RETURNING *', [project_name, category, description, technologies, link]);
            return result.rows[0];
        });
    },
    findAll(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db.query('SELECT * FROM project ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
            //avoid using business logic here
            return result.rows;
        });
    },
    findAllForAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db.query('SELECT * FROM project ORDER BY created_at DESC');
            return result.rows;
        });
    },
    getTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db.query('SELECT COUNT(*) FROM project');
            return parseInt(result.rows[0].count, 10);
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db.query('SELECT * FROM project WHERE id = $1', [id]);
            if (!result.rows[0]) {
                console.log('cannot fetch result');
            }
            return result.rows[0];
        });
    },
    update(id, project_name, category, description, technologies, link) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db.query(`UPDATE project
     SET project_name = $1,
         category = $2,
         description = $3,
         technologies = $4,
         link = $5
     WHERE id = $6
     RETURNING id, project_name, category, description, technologies, link, created_at, updated_at`, [project_name, category, description, technologies, link, id]);
            console.log('Update result:', result.rows[0]);
            return result.rows;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db.query('DELETE FROM project WHERE id = $1 RETURNING id, project_name', [id]);
            console.log('Delete result:', result.rows[0]);
            return result.rows; // You can return the deleted project's info
        });
    }
};
exports.default = ProjectDAO;
