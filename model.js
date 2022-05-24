class webDB {
    constructor(_recordName, _fields) {
        this.db = null;
        this.complete = Promise.resolve('done')
        this.version = localStorage.getItem("lversionClass") == null ? 0 : localStorage.getItem('lversionClass')
        if (this.version == 0) {
            this.complete = this.addClasses(_recordName, 1, _fields).then(r => console.log("db opened")).catch(err => console.log)
        }
    }
    addClasses(_recordName, _version, _fields) {
        let curObj = this;
        return new Promise((res, rej) => {
            let vsn = parseInt(curObj.version) + 1
            let request = indexedDB.open(_recordName, vsn)
            request.onupgradeneeded = e => {
                curObj.db = request.result;
                let os;
                if (!curObj.db.objectStoreNames.contains("collegeTable"))
                    os = curObj.db.createObjectStore("collegeTable", { keyPath: 'adm_no' })
                else {
                    curObj.db.deleteObjectStore("collegeTable")
                    os = curObj.db.createObjectStore("collegeTable", { keyPath: 'adm_no' })
                }
                _fields.forEach(f => {
                    os.createIndex(f, f, { unique: false })
                })
            }
            request.onsuccess = e => {
                curObj.db = request.result
                localStorage.setItem('lversionClass', curObj.version)
                res(true);
            }
            request.onerror = e => {
                rej(false)
                console.log("eror")
            }
        })
    }
    addData(_data, table_name = 'collegeTable') {
        var tx = this.db.transaction(table_name, 'readwrite');
        var collegeTable = tx.objectStore(table_name);
        collegeTable.add(_data)
        return new Promise((res, rej) => {
            tx.oncomplete = e => {
                res(true)
            }
            tx.onerror = e => {
                rej(e.srcElement.error)
            }
        })
    }
    updateData(_data, table_name = 'collegeTable') {
        var tx = this.db.transaction(table_name, 'readwrite');
        var collegeTable = tx.objectStore(table_name);
        collegeTable.put(_data)
        return new Promise((res, rej) => {
            tx.oncomplete = e => {
                res(true)
            }
            tx.onerror = e => {
                rej(e.srcElement.error)
            }
        })
    }
    getData(by, value, table_name = 'collegeTable') {
        let tx = cdb.db.transaction(table_name, 'readonly')
        let os = tx.objectStore('collegeTable')
        let sv = os.index(by).getAll(value)
        return new Promise((res, rej) => {
            tx.oncomplete = e => {
                res(sv.result)
            }
            tx.onerror = e => {
                rej(e.srcElement.error)
            }
        })
    }
}
