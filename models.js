import mongoose from 'mongoose'

// models will have my db collection connections
const models = {}
console.log("connecting to mongodb")

await mongoose.connect("mongodb+srv://twang85_db_user:Wtt20030805@cluster0.zsxnd7u.mongodb.net/websharer")
console.log("successfully connected to mongodb!")

const postSchema = new mongoose.Schema({
    url: String,
    description: String,
    username: String,
    likes: [String],
    created_date: Date
})

models.Post = mongoose.model('Post', postSchema)


const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    post: mongoose.Schema.Types.ObjectId,
    created_date: Date
})

models.Comment = mongoose.model('Comment', commentSchema)

const userSchema = new mongoose.Schema({
    username: String,
    grade: String, // freshman, sophomore, junior, senior
})

models.User = mongoose.model('User', userSchema)

console.log('mongoose models created')

export default models;