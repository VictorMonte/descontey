import {Container} from "inversify";
import DataBaseConfiguration from "./databaseConfiguration";
import App from "../../app";
import { TYPES } from "./types";
import DiscountService from "../../domain/discount/discountService";
import { DiscountServiceGrpc } from "../../presentation/grpc/discountServiceGrpc";

let container = new Container();

container.bind<App>(TYPES.App).to(App).inSingletonScope();
container.bind<DataBaseConfiguration>(TYPES.Database).toConstantValue(new DataBaseConfiguration());
container.bind<DiscountService>(TYPES.DiscountService).to(DiscountService).inTransientScope();
container.bind<DiscountServiceGrpc>(TYPES.DiscountServiceGrpc).to(DiscountServiceGrpc).inTransientScope();

export default container;
