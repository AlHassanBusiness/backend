import Admin from '../models/admin.model.js'
import bcrypt from 'bcryptjs'

export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const admin = await Admin.findOne({
            $or: [{ email }, { name }],
        }).exec()
        if (admin) {
            return res
                .status(400)
                .json({ error: 'Username or email already exists' })
        }

        const newAdmin = new Admin({
            name,
            email,
            password: hash,
        })

        await newAdmin.save()

        res.status(201).json({
            message: 'Admin created successfully',
            data: newAdmin,
        })
    } catch (error) {
        console.log('Error in create admin controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id)

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' })
        }

        await Admin.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message: 'Admin deleted successfully',
        })
    } catch (error) {
        console.log('Error in delete admin controller', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
