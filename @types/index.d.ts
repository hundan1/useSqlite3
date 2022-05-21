// declare let MySqlite: import("../assets/scripts/utils/Sql3").MySqlite;

declare let foo: string;

declare namespace ns {
    class SomeClass {
        xxx;
        yyy;
        foo();
        static static_func();
        static static_val;


        setCallback(
            callback: (counter: number) => void,
            target: object
        ): void;
        setCallback(target: object): void;
    }
}

// declare var sql = {
//     SQLiteWrapper: SQLiteWrapper,
//     SQLiteStatement: SQLiteStatement
// }


declare module sql {
    module SQLiteWrapper {

    }
    class SQLiteWrapper {
        initializing(db_file: string, projname: string, searchPath: string, searchResolution: string, isAbsolutePath: string): boolean
        isOpen(): boolean
        close(): boolean
        statement(statement: string): SQLiteStatement
        // directStatement(stmt: string): boolean
        exec(stmt: string): boolean
        errmsg(): string
        begin(): boolean
        commit(): boolean
        rollback(): boolean
    }

    module SQLiteStatement {
        enum DataType {
            INT = 1,
            FLT = 2,
            TXT = 3,
            BLB = 4,
            NUL = 5,
        }
    }

    class SQLiteStatement {
        bind(pos_zero_indexed: number, value: string): boolean
        bind(pos_zero_indexed: number, value: number): boolean
        bindNull(pos_zero_indexed: number): boolean
        dataType(pos_zero_indexed: number): DataType
        // dataType(pos_zero_indexed: number): string
        execute(): boolean

        getColumnCount(): number
        getColumnName(pos_zero_indexed: number): string
        nextRow(): boolean
        reset(): boolean
        restartSelect(): boolean
        finalize(): boolean
        valueInt(pos_zero_indexed: number): number
        /** 解析REAL(浮点型)数据 */
        valueDouble(pos_zero_indexed: number): number
        valueString(pos_zero_indexed: number): string
    }

    // enum TransactionOperation {
    //     BEGIN = 0,
    //     COMMIT = 1,
    //     ROLLBACK = 2
    // }
    enum TransactionOperation {
        BEGIN = "begin",
        COMMIT = "commit",
        ROLLBACK = "rollback"
    }
}


// declare namespace MySqlite {
//     enum TransactionOperation {
//         BEGIN = 0,
//         COMMIT = 1,
//         ROLLBACK = 2
//     }
// }
declare class MySqlite {
    // public static readonly TransactionOperation = TransactionOperation;
    _sqlMng: sql.SQLiteWrapper;
    filename: string;
    projname: string;
}





declare class SqliteBase {
    transactions;
    id_: Number;
}