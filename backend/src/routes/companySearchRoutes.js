const { searchCompanies, getCompanyById } = require("../controllers/companyController");

router.get("/search", searchCompanies);

router.get("/:id", getCompanyById);
