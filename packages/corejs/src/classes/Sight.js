export default class Sight {
  constructor(id, poz, label) {
    this._id = id;
    this._label = label;

    const [p, o, z] = poz;
    this._poz = { p, o, z };
  }

  toString() {
    return `${this._label} {"id": ${this._id}, "(ρφz)": (${this._poz.p}, ${this._poz.o},${this._poz.z})}`;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get label() {
    return this._label;
  }

  set label(value) {
    this._label = value;
  }

  get poz() {
    return this._poz;
  }

  set poz(value) {
    this._poz = value;
  }
}
