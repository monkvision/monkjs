"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleSights = exports.vehicles = exports.labels = void 0;
const types_1 = require("./types");
const labels_json_1 = __importDefault(require("./data/labels.json"));
const vehicles_json_1 = __importDefault(require("./data/vehicles.json"));
const all_json_1 = __importDefault(require("./data/sights/all.json"));
const audia7_json_1 = __importDefault(require("./data/sights/audia7.json"));
const fesc20_json_1 = __importDefault(require("./data/sights/fesc20.json"));
const ff150_json_1 = __importDefault(require("./data/sights/ff150.json"));
const ffocus18_json_1 = __importDefault(require("./data/sights/ffocus18.json"));
const ftransit18_json_1 = __importDefault(require("./data/sights/ftransit18.json"));
const haccord_json_1 = __importDefault(require("./data/sights/haccord.json"));
const jgc21_json_1 = __importDefault(require("./data/sights/jgc21.json"));
const tsienna20_json_1 = __importDefault(require("./data/sights/tsienna20.json"));
const vwtroc_json_1 = __importDefault(require("./data/sights/vwtroc.json"));
const labels = labels_json_1.default;
exports.labels = labels;
const vehicles = vehicles_json_1.default;
exports.vehicles = vehicles;
const vehicleSights = {
    [types_1.VehicleType.ALL]: all_json_1.default,
    [types_1.VehicleType.AUDIA7]: audia7_json_1.default,
    [types_1.VehicleType.FESC20]: fesc20_json_1.default,
    [types_1.VehicleType.FF150]: ff150_json_1.default,
    [types_1.VehicleType.FFOCUS18]: ffocus18_json_1.default,
    [types_1.VehicleType.FTRANSIT18]: ftransit18_json_1.default,
    [types_1.VehicleType.HACCORD]: haccord_json_1.default,
    [types_1.VehicleType.JGC21]: jgc21_json_1.default,
    [types_1.VehicleType.TSIENNA20]: tsienna20_json_1.default,
    [types_1.VehicleType.VWTROC]: vwtroc_json_1.default,
};
exports.vehicleSights = vehicleSights;
//# sourceMappingURL=data.js.map