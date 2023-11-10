const express = require('express')
const route = express.Router()
const AdminController = require('../controllers/AdminController')

route.get('/:id', AdminController.homePage)

route.get('/:id/profil', AdminController.profile)
route.get('/:id/profil/edit', AdminController.editProfileGet)
route.post('/:id/profil/edit', AdminController.editProfilePost)

route.get('/:id/dasbor', AdminController.dashboard)

route.get('/:id/masyarakat', AdminController.masyarakatList)
route.get('/:id/masyarakat/:idMasyarakat', AdminController.masyarakatDetail)
route.get('/:id/masyarakat/:idMasyarakat/edit', AdminController.masyarakatEditGet)
route.post('/:id/masyarakat/:idMasyarakat/edit', AdminController.masyarakatEditPost)
route.get('/:id/masyarakat/:idMasyarakat/delete', AdminController.masyarakatDelete)

route.get('/:id/petugas', AdminController.petugasList)
route.get('/:id/petugas/tambah', AdminController.petugasRegisGet)
route.post('/:id/petugas/tambah', AdminController.petugasRegisPost)
route.get('/:id/petugas/:idPetugas', AdminController.petugasDetail)

route.get('/:id/laporan', AdminController.belumBalas)
route.get('/:id/laporan/:idLap', AdminController.belumBalasDetail)
route.post('/:id/laporan/:idLap', AdminController.balas)

route.get('/:id/selesai', AdminController.sudahBalas)
route.get('/:id/selesai/:idLap', AdminController.sudahBalasDetail)

route.get('/:id/riwayat', AdminController.riwayat)
route.get('/:id/riwayat/:idBalasan', AdminController.riwayatDetail)

module.exports = route