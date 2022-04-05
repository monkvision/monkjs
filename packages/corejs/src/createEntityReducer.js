export default function createEntityReducer(key, entityAdapter) {
  return {
    gotOne: (state, action) => {
      const { entities, result } = action.payload;
      const entity = entities[key][result];
      entityAdapter.upsertOne(state, entity);
    },
    gotMany: (state, action) => {
      const { entities } = action.payload;
      entityAdapter.upsertMany(state, entities[key]);
    },
    updatedOne: (state, action) => {
      const { entities, result } = action.payload;
      const entity = entities[key][result];
      entityAdapter.updateOne(state, entity);
    },
    updatedMany: (state, action) => {
      const { entities } = action.payload;
      entityAdapter.upsertMany(state, entities[key]);
    },
    deletedOne: (state, action) => {
      const { result } = action.payload;
      entityAdapter.removeOne(state, result);
    },
    deleteMany: (state, action) => {
      const { result } = action.payload;
      entityAdapter.removeMany(state, result[key]);
    },
    reset: (state) => entityAdapter.removeAll(state),
  };
}
