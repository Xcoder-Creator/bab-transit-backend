// Validate matric no
let validate_matric_no = (matric_no) => {
    var matric_year = matric_no.substr(0, 2); // Year of matriculation
    var slash = matric_no.substr(2, 1); // Slash in matric no
    var last_digits = matric_no.substr(-4, 4); // Last 4 digits after the slash in matric no

    // Validate matric no
    if (parseInt(matric_year) === NaN){
        return false;
    } else if (matric_year.length === 2){
        if (slash == '/'){
            if (last_digits.length === 4){
                if (parseInt(last_digits) !== NaN){
                    if (last_digits.substr(0, 1) !== '/'){
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
    //------------------------------
}
//--------------------------------------------

module.exports = validate_matric_no;