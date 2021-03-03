import { Op } from 'sequelize';

export const queryParser = (obj: any) => {

  return Object.keys(obj).reduce((accumulator, key) => {

    switch (key) {
      case '$gt':
        accumulator[Op.gt] = obj[key];
        break;
      case '$gte':
        accumulator[Op.gte] = obj[key];
        break;
      case '$lt':
        accumulator[Op.lt] = obj[key];
        break;
      case '$lte':
        accumulator[Op.lte] = obj[key];
        break;
      case '$ne':
        accumulator[Op.ne] = obj[key];
        break;
      case '$in':
        accumulator[Op.in] = obj[key];
        break;
      case '$between':
        accumulator[Op.between] = obj[key];
        break;
      case '$iLike':
        accumulator[Op.iLike] = obj[key];
        break;
      case '$or':
        accumulator[Op.or] = obj[key];
        break;
      case '$and':
        accumulator[Op.and] = obj[key];
        break;
      default:
        if (obj[key] && !Array.isArray(obj[key]) && typeof obj[key] === 'object') {
          accumulator[key] = queryParser(obj[key]);
        } else {
          accumulator[key] = obj[key];
        }
    }

    return accumulator;
  }, { });

};
