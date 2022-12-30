import express from 'express';

import 'express-async-errors';
import {
  getAllRecords,
  createRecord,
  getRecordById,
  updateRecord,
  deleteRecord,
} from './record.controller';
import { validateCreateRecord } from './validation';
import { authorization } from '../Auth/auth.controller';

const router = express.Router();

//Get all records
router.get('/', authorization, getAllRecords);

//Create a record
router.post('/', authorization, validateCreateRecord, createRecord);

//Get a single record
router.get('/:id', authorization, getRecordById);

//Update a single record
router.put('/:id', authorization, updateRecord);

//Delete a single record
router.delete('/:id', authorization, deleteRecord);

export default router;
