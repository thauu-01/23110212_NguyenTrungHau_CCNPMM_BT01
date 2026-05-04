import db from '../models/index'; //import database
import CRUDService from '../services/CRUDService'; //import service

//hàm getHomePage
let getHomePage = async (req, res) => {
    try {
        // lấy dữ liệu từ models/index thông qua Sequelize findall
        let data = await db.User.findAll(); 

        console.log('....................................');
        console.log(data);
        console.log('....................................');

        // trả dữ liệu data về view 'homepage.ejs'
        return res.render('homepage.ejs', {
            data: JSON.stringify(data) 
        });

    } catch (e) {
        console.log(e);
    }
}

//hàm getAbout
let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}

// hàm CRUD
let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

// hàm findAll CRUD
let getFindAllCrud = async (req, res) => {
    // Gọi hàm getAllUser từ CRUDService để lấy toàn bộ dữ liệu người dùng
    let data = await CRUDService.getAllUser();
    
    // console.log('-----------------------');
    // console.log(data);
    // console.log('-----------------------');

    // Gọi view và truyền dữ liệu ra view 'users/findAllUser.ejs'
    return res.render('users/findAllUser.ejs', {
        datalist: data
    });
}

// hàm post CRUD
let postCRUD = async (req, res) => {
    // Dùng async để xử lý bất đồng bộ khi tạo người dùng mới
    // req.body chứa các thông tin gửi lên từ form (input name)
    let message = await CRUDService.createNewUser(req.body);
    
    // console.log(req.body); // lấy thông tin body của http request
    console.log(message);
    
    return res.send('Post crud to server');
}


// hàm lấy dữ liệu để edit
let getEditCRUD = async (req, res) => {
    let userId = req.query.id; // Lấy id từ query string (ví dụ: /edit-crud?id=1)
    
    if (userId) { // check Id tồn tại
        let userData = await CRUDService.getUserInfoById(userId);
        
        // console.log('-----------------------');
        // console.log(userData);
        // console.log('-----------------------');

        return res.render('users/editUser.ejs', {
            data: userData // truyền dữ liệu user cần edit sang view
        });

    } else {
        return res.send('không lấy được id');
    }

    // console.log(req.query.id);
}

// hàm cập nhật dữ liệu (Update)
let putCRUD = async (req, res) => {
    let data = req.body; // lấy dữ liệu từ form edit gửi lên
    
    // gọi service update dữ liệu và đợi kết quả trả về danh sách user mới
    let data1 = await CRUDService.updateUser(data); // update rồi hiển thị lại danh sách user
    
    // render lại trang danh sách người dùng với dữ liệu đã cập nhật
    return res.render('users/findAllUser.ejs', {
        datalist: data1
    });

    // return res.send('update thành công');
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id; // Lấy id từ URL (ví dụ: /delete-crud?id=1)
    
    if (id) {
        // Gọi service để xóa người dùng dựa trên id
        await CRUDService.deleteUserById(id);
        return res.send('Deleted!!!!!!!!!!!!!');
    } else {
        return res.send('Not find user');
    }
}

// Cuối file homeController.js
export default {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    getFindAllCrud: getFindAllCrud,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}