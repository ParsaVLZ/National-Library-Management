import { TypeOrmModuleOptions } from "@nestjs/typeorm"
export function TypeOrmConfig(): TypeOrmModuleOptions{
    const {DB_HOST, DB_NAME, DB_PORT, DB_USERNAME, DB_PASSWORD} = process.env;
    return {
        type: "postgres",
        host: DB_HOST,
        port: +DB_PORT,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        autoLoadEntities: true,
        synchronize: true
    }
}
