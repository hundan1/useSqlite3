import * as $moment from "moment";
let formatSql = {
    // insert1当values<ArrayObject> 为不规则数据时，即 一些columns里的字段 对象没有这个key 该字段插入数据库中的值为'undefined'
    insert1({ table, columns, values }) {
        let sqlStr = '';
        try {
            sqlStr = `INSERT INTO '${table}' (${columns.join(',')}) VALUES `;
            values.forEach((row, i) => {
                let pushtxt = '(';
                columns.forEach((field, column_index) => {
                    let value = row[field];
                    let valueTxt = "";
                    if (typeof value == 'number') {
                        valueTxt = value.toString();
                    } else {
                        valueTxt = `'${value}'`;
                    }
                    if (field == 'id') {
                        valueTxt = 'NULL';
                    } else if (field == 'modifytime') {
                        let now = $moment().format('YYYY-MM-DD HH:mm:ss');
                        valueTxt = `'${now}'`;
                    }
                    pushtxt += valueTxt;

                    if (column_index != columns.length - 1) {
                        pushtxt += ',';
                    }
                });
                if (i == values.length - 1) {
                    sqlStr += (pushtxt + ');');
                } else {
                    sqlStr += (pushtxt + '),');
                }
            });
            return sqlStr;
        } catch (err) {
            sqlStr = '';
            console.error('format insert1 sqlStr error:', err);
        } finally {
            return sqlStr;
        }
    },
    // table <String> tableName columns<Object> fields&values
    insert2({ table, columns }) {
        let sqlStr = '';
        try {
            let fields = Object.keys(columns);
            sqlStr = `INSERT INTO '${table}' (${fields.join(',')}) VALUES `;

            let values = [];
            fields.forEach((field, i) => {
                let value = columns[field];
                if (typeof value == 'number') {
                    values.push(value);
                } else {
                    values.push(`'${value}'`);
                }
            });

            sqlStr += `(${values.join(',')})`;
        } catch (err) {
            sqlStr = '';
            console.error('format insert2 sqlStr error:', err);
        } finally {
            return sqlStr;
        }
    },
    select1({ table, columns = ['*'] }) {
        let sqlStr = '';
        try {
            sqlStr += `SELECT `;
            sqlStr += columns.join(', ');
            sqlStr += ` FROM '${table}'`;
            return sqlStr;
        } catch (err) {
            sqlStr = '';
            console.error('format select1 sqlStr error:', err);
        } finally {
            return sqlStr;
        }
    },
    /**
     * 数据库修改语句格式化
     * @param {string} table 表名  
     * @param {object} columns 要更新的字段和字段值  
     * @param {string} [whereRow=''] 条件子句,不传默认修改所有记录
     * */
    update1({ table, columns = {}, whereRow = '' }) {
        let sqlStr = '';
        try {
            let fields = Object.keys(columns);
            if (fields.length == 0) {
                console.error('format update1 sqlStr error:');
                return;
            }
            sqlStr += `UPDATE '${table}' SET`;

            let setRow = [];
            fields.forEach((field, i) => {
                let value = columns[field];
                if (typeof value == 'number') {
                    setRow.push(` ${field} = ${value}`);
                } else {
                    setRow.push(` ${field} = '${value}'`);
                }
            });

            sqlStr += `${setRow.join(',')}`;
            if (whereRow) {
                sqlStr += ` ${whereRow}`;
            }
            sqlStr += ';';
        } catch (err) {
            sqlStr = '';
            console.error('format update1 sqlStr error:', err);
        } finally {
            return sqlStr;
        }
    },
    /**
     * 数据库删除语句格式化
     * @param {string} table 表名  
     * @param {string} [whereRow=''] 条件子句,不传默认删除所有记录
     * */
    delete1({ table, whereRow = '' }) {
        let sqlStr = '';
        try {
            sqlStr += `DELETE FROM '${table}'`;
            if (whereRow) {
                sqlStr += ` ${whereRow}`;
            }
            sqlStr += ';';
        } catch (err) {
            sqlStr = '';
            console.error('format delete1 sqlStr error:', err);
        } finally {
            return sqlStr;
        }
    },
};
export default formatSql;