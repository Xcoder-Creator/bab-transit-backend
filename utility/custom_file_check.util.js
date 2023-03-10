// Check if any file was uploaded
let custom_file_check = (file) => {
    //Check if the files object is set
    if (file){
        //Check if the uploaded file in an object
        if (typeof file === 'object'){
            return true;
        } else {
            return false;
        }
        //--------------------------------------
    } else {
        return false;
    }
    //----------------------------------------
}
//------------------------------------

module.exports = custom_file_check;