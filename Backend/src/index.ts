import Express from "express";
import cors from "cors";
import UsersRoute from "./router/userRouter";
import SocietyRoute from "./router/societyRouter";
import PortofolioRoute from "./router/portofolioRouter";
import CompanyRoute from "./router/companyRouter";
import AvailablePositionRoute from "./router/availablePositionRouter";
import PositionAppliedRoute from "./router/positionAppliedRouter";


const app = Express();

app.use(cors({
  origin: "http://localhost:3000", // frontend Next.js
  credentials: true,               // kalau kirim cookie / auth header
}));

app.use(Express.json());

app.use(`/auth`, UsersRoute);
app.use(`/society`, SocietyRoute);
app.use(`/portofolio`, PortofolioRoute);
app.use(`/company`, CompanyRoute);
app.use(`/availablePosition`, AvailablePositionRoute);
app.use(`/positionApplied`, PositionAppliedRoute);


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server Jobseeker's run on port ${PORT}`);
});