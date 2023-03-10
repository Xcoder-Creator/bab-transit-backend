const fs = require('fs'); // Import fs module

// Delete uploaded file by user
let delete_file = (file_name) => {
    fs.unlinkSync(`public/${file_name}`, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('file deleted');
        }
    });
}
//-----------------------------------------

module.exports = delete_file;