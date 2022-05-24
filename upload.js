let dataForm = document.getElementsByName('dataForm')[0]
let fields = ['adm_no', 'roll_no', 'name', 'class', 't_attend']
let cdb = new webDB("collegeDB", fields)//collegeDb is database 
dataForm.addEventListener('submit', submitData)
function submitData(e) {
    e.preventDefault()
    let fd = new FormData(dataForm)
    let data = Object.fromEntries(fd.entries())
    data.files = dataForm.files.files
    cdb.updateData(data).then(() => console.log('succesfull')).catch(err => console.log(err))
}
