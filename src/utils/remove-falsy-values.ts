export const removeFalsyValues = (obj: any) => {

  return Object.keys(obj).reduce((acc, o) => {

    if (obj[o] !== null && obj[o] !== undefined) {
      acc[o] = obj[o];
    }

    return acc;
  }, { });

};
