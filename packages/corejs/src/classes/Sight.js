export default class Sight {
  /**
   * @param id {string}
   * @param poz {[number]}
   * @param label {string}
   * @param flags {[string]}
   */
  constructor(id, poz, label, flags) {
    this._id = id;
    this._label = label;
    this._flags = flags;

    const [p, o, z] = poz;
    this._poz = { p, o, z };
  }

  toString() {
    return `
      ${this._label}
      {"id": ${this._id}, "(ρφz)": (${this._poz.p}, ${this._poz.o},${this._poz.z})}
    `;
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

  get flags() {
    return this._flags;
  }

  set flags(value) {
    this._flags = value;
  }
}
