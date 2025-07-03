import express from 'express';
import { createCustomerController, deleteCustomerController, getCustomerByUserIdController, getPaginatedCustomersHandler, importExcel, updateCustomerController, updatePriodCustomerController } from './customer.controller';
import { protect } from '../../common/middlewares/auth.middleware';
import { uploadExcel } from '../../common/middlewares/upload.middleware';
import path from 'path';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getCustomerByUserIdController)
    .post(createCustomerController);

router.get('/paginated', getPaginatedCustomersHandler);

router.post('/import-excel', uploadExcel, importExcel);

router.route('/:customerId')
    .put(updateCustomerController)
    .delete(deleteCustomerController);

router.put('/:customerId/update-priod', updatePriodCustomerController);

// Route để tải file mẫu
router.get('/download-template', protect, (req, res) => {
    const filePath = path.join(__dirname, '../../samples/file-sample.xlsx');
    res.download(filePath, 'template.xlsx');
});

export default router;