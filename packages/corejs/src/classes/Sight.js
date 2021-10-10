export default class Sight {
  constructor(id, poz) {
    this._id = id;

    const [p, o, z] = poz;
    this._poz = { p, o, z };
    this._poz = poz;
  }

  toString() {
    return `{"id": ${this._id}, "(ρφz)": { "ρ": ${this._poz.p}, "φ": ${this._poz.o}, "z": ${this._poz.z}}}`;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get poz() {
    return this._poz;
  }

  set poz(value) {
    this._poz = value;
  }
}
