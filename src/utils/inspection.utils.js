import camelCase from "lodash.camelcase";

export function getInitialActiveParts(data) {
  if (!data) {
    return {};
  }
  const { damages, parts } = data;
  const activeParts = {};
  if (damages) {
    damages.forEach((damage) => {
      damage.part_ids.forEach((part_id) => {
        const part = parts.find(({ id }) => id === part_id);
        activeParts[camelCase(part.part_type)] = true;
      });
    });
  }
  return activeParts;
}

export default {};
