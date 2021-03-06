"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _useSelect2 = _interopRequireDefault(require("./useSelect"));

var _Value = _interopRequireDefault(require("./Components/Value"));

var _Options = _interopRequireDefault(require("./Components/Options"));

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SelectSearch = (0, _react.forwardRef)(function (_ref, ref) {
  var defaultValue = _ref.value,
      disabled = _ref.disabled,
      placeholder = _ref.placeholder,
      multiple = _ref.multiple,
      search = _ref.search,
      autoFocus = _ref.autoFocus,
      autoComplete = _ref.autoComplete,
      defaultOptions = _ref.options,
      onChange = _ref.onChange,
      printOptions = _ref.printOptions,
      closeOnSelect = _ref.closeOnSelect,
      className = _ref.className,
      renderValue = _ref.renderValue,
      renderOption = _ref.renderOption,
      renderGroupHeader = _ref.renderGroupHeader,
      getOptions = _ref.getOptions,
      fuse = _ref.fuse;
  var selectRef = (0, _react.createRef)();

  var _useSelect = (0, _useSelect2["default"])({
    options: defaultOptions,
    value: defaultValue,
    multiple: multiple,
    disabled: disabled,
    fuse: fuse,
    search: search,
    onChange: onChange,
    getOptions: getOptions,
    closeOnSelect: closeOnSelect,
    allowEmpty: !!placeholder
  }),
      snapshot = _useSelect[0],
      valueProps = _useSelect[1],
      optionProps = _useSelect[2];

  var classNameFn = typeof className === 'string' ? function (key) {
    if (key.indexOf('container') === 0) {
      return key.replace('container', className);
    }

    if (key.indexOf('is-') === 0 || key.indexOf('has-') === 0) {
      return key;
    }

    return className.split(' ')[0] + "__" + key;
  } : className;
  var wrapperClass = [classNameFn('container'), snapshot.searching ? classNameFn('is-loading') : false, snapshot.focus ? classNameFn('has-focus') : false].filter(function (cls) {
    return !!cls;
  }).join(' ');
  var value = snapshot.focus && search ? snapshot.search : snapshot.displayValue;
  (0, _react.useEffect)(function () {
    if (!selectRef.current) {
      return;
    }

    var query = null;

    if (snapshot.highlighted > -1) {
      query = "[data-index=\"" + snapshot.highlighted + "\"]";
    } else if (snapshot.value && !multiple) {
      query = "[data-value=\"" + escape(snapshot.value.value) + "\"]";
    }

    var selected = selectRef.current.querySelector(query);

    if (selected) {
      var rect = selectRef.current.getBoundingClientRect();
      var selectedRect = selected.getBoundingClientRect();
      selectRef.current.scrollTop = selected.offsetTop - rect.height / 2 + selectedRect.height / 2;
    }
  }, [snapshot.focus, snapshot.value, snapshot.highlighted, selectRef, multiple]);
  var shouldRenderOptions = true;

  switch (printOptions) {
    case 'never':
      shouldRenderOptions = false;
      break;

    case 'always':
      shouldRenderOptions = true;
      break;

    case 'on-focus':
      shouldRenderOptions = snapshot.focus;
      break;

    default:
      shouldRenderOptions = !disabled && (snapshot.focus || multiple);
      break;
  }

  var valueComp = renderValue ? /*#__PURE__*/_react["default"].createElement("div", {
    className: classNameFn('value')
  }, renderValue(_objectSpread(_objectSpread({}, valueProps), {}, {
    placeholder: placeholder,
    autoFocus: autoFocus,
    autoComplete: autoComplete,
    value: value
  }), snapshot, classNameFn('input'))) : /*#__PURE__*/_react["default"].createElement(_Value["default"], {
    disabled: disabled,
    search: search,
    autoFocus: autoFocus,
    displayValue: value,
    className: classNameFn,
    valueProps: valueProps,
    autoComplete: autoComplete,
    placeholder: placeholder
  });
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: ref,
    className: wrapperClass
  }, (!multiple || placeholder || search) && valueComp, shouldRenderOptions && /*#__PURE__*/_react["default"].createElement("div", {
    className: classNameFn('select'),
    ref: selectRef
  }, /*#__PURE__*/_react["default"].createElement(_Options["default"], {
    options: snapshot.options,
    snapshot: snapshot,
    optionProps: optionProps,
    className: classNameFn,
    renderOption: renderOption,
    renderGroupHeader: renderGroupHeader
  })));
});
SelectSearch.defaultProps = {
  className: 'select-search',
  disabled: false,
  search: false,
  multiple: false,
  placeholder: null,
  autoFocus: false,
  autoComplete: 'on',
  value: '',
  onChange: function onChange() {},
  printOptions: 'auto',
  closeOnSelect: true,
  renderOption: null,
  renderGroupHeader: function renderGroupHeader(name) {
    return name;
  },
  renderValue: null,
  fuse: {
    keys: ['name', 'groupName'],
    threshold: 0.3
  },
  getOptions: null
};
SelectSearch.propTypes = process.env.NODE_ENV !== "production" ? {
  options: _propTypes["default"].arrayOf(_types.optionType).isRequired,
  getOptions: _propTypes["default"].func,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].arrayOf(_propTypes["default"].string)]),
  className: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].func]),
  multiple: _propTypes["default"].bool,
  search: _propTypes["default"].bool,
  disabled: _propTypes["default"].bool,
  placeholder: _propTypes["default"].string,
  autoComplete: _propTypes["default"].string,
  autoFocus: _propTypes["default"].bool,
  onChange: _propTypes["default"].func,
  printOptions: _propTypes["default"].oneOf(['auto', 'always', 'never', 'on-focus']),
  closeOnSelect: _propTypes["default"].bool,
  renderOption: _propTypes["default"].func,
  renderGroupHeader: _propTypes["default"].func,
  renderValue: _propTypes["default"].func,
  fuse: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].shape({
    keys: _propTypes["default"].arrayOf(_propTypes["default"].string),
    threshold: _propTypes["default"].number
  })])
} : {};

var _default = (0, _react.memo)(SelectSearch);

exports["default"] = _default;