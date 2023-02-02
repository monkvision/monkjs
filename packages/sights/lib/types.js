"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleType = exports.SightCategory = void 0;
/**
 * The category of a Sight.
 */
var SightCategory;
(function (SightCategory) {
    /**
     * The category for sights representing the interior of a car.
     */
    SightCategory["INTERIOR"] = "interior";
    /**
     * The category for sights representing the exterior of a car.
     */
    SightCategory["EXTERIOR"] = "exterior";
    /**
     * The category for sights representing miscellaneous parts of a car (VIN number...)
     */
    SightCategory["MISC"] = "misc";
})(SightCategory = exports.SightCategory || (exports.SightCategory = {}));
/**
 * The different types of vehicle available in the Sights package.
 */
var VehicleType;
(function (VehicleType) {
    /**
     * All vehicle types. This vehicle type is used by sights that can be used in any vehicle.
     */
    VehicleType["ALL"] = "all";
    /**
     * Hatchback : Audi A7
     */
    VehicleType["AUDIA7"] = "audia7";
    /**
     * Crossover : Ford Escape SE 2020
     */
    VehicleType["FESC20"] = "fesc20";
    /**
     * Pickup : Ford F-150 Super Cab XL 2014
     */
    VehicleType["FF150"] = "ff150";
    /**
     * City : Ford Focus
     */
    VehicleType["FFOCUS18"] = "ffocus18";
    /**
     * Van : Ford Transit Fourgon L3H2 Trendline 2018
     */
    VehicleType["FTRANSIT18"] = "ftransit18";
    /**
     * Sedan : Honda Accord Sedan Sport US spec 2018
     */
    VehicleType["HACCORD"] = "haccord";
    /**
     * Large SUV : Jeep Grand Cherokee L Summit 2021
     */
    VehicleType["JGC21"] = "jgc21";
    /**
     * Minivan : Toyota Sienna Limited 2020
     */
    VehicleType["TSIENNA20"] = "tsienna20";
    /**
     * Small Crossover/SUV : Volkswagen T-Roc
     */
    VehicleType["VWTROC"] = "vwtroc";
})(VehicleType = exports.VehicleType || (exports.VehicleType = {}));
//# sourceMappingURL=types.js.map