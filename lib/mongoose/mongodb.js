import mongoose from "mongoose";

const uri = process.env.DB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connect = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  const configs = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  cached.promise = mongoose.connect(uri, configs).then((mongoose) => {
    return mongoose;
  });

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connect;
