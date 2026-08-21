export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Erreur interne du serveur",
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
// au lien de mettre des try/cach de 10 lignes partout dans le code, on le met dans un middleware et on l'utilise comme ca 
/*

   const createUser = async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    user
  });
};

لكن هنا إذا حدث خطأ، يجب أن نرسل الخطأ إلى الـ middleware.

نستعمل دالة صغيرة مثل:

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

ثم:

const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);


  res.status(201).json({
    success: true,
    user
  });
});



*/