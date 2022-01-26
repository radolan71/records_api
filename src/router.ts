import express from 'express';
import recordRoutes from './app/record/RecordRoutes';

const router = express.Router({ strict: true });
const baseRoutes = express.Router();

router.use('/records', recordRoutes);
baseRoutes.get('/', function (req, res) {
  res.send({
    name: `Getir Challenge ${process.env.BASE_API_URI}`,
    version: process.env.npm_package_version,
  });
});
router.use('/', baseRoutes);

export default router;
