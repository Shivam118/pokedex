const fourDigitId = (id) => {
  if (id < 10) {
    return `#00${id}`;
  } else if (id < 100) {
    return `#0${id}`;
  } else if (id < 1000) {
    return `#${id}`;
  } else {
    return `#${id}`;
  }
};

export { fourDigitId };
