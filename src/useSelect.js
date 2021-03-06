import {
    useEffect,
    useMemo,
    useState,
    useRef,
} from 'react';
import highlightReducer from './highlightReducer';
import getDisplayValue from './lib/getDisplayValue';
import flattenOptions from './lib/flattenOptions';
import GroupOptions from './lib/groupOptions';
import getNewValue from './lib/getNewValue';
import getOption from './lib/getOption';
import doSearch from './search';

export default function useSelectSearch({
    value: defaultValue = null,
    disabled = false,
    multiple = false,
    search: canSearch = false,
    fuse = false,
    options: defaultOptions,
    onChange = () => {},
    getOptions = null,
    allowEmpty = true,
    closeOnSelect = true,
}) {
    const ref = useRef(null);
    const flatDefaultOptions = useMemo(() => flattenOptions(defaultOptions), [defaultOptions]);
    const [state, setState] = useState({
        flat: [],
        addedOptions: [],
        value: defaultValue,
        search: '',
        focus: false,
        searching: false,
        highlighted: -1,
    });

    const {
        flat,
        addedOptions,
        value,
        search,
        focus,
        searching,
        highlighted,
    } = state;

    const option = useMemo(() => {
        let newOption = getOption(value, [...flatDefaultOptions, ...addedOptions]);

        if (!newOption && !allowEmpty && !multiple) {
            ([newOption] = flatDefaultOptions);
        }

        return newOption;
    }, [value, flatDefaultOptions, addedOptions, allowEmpty, multiple]);
    const options = useMemo(() => GroupOptions(flat), [flat]);
    const displayValue = useMemo(() => getDisplayValue(option), [option]);
    const onBlur = () => {
        setState(oldState => ({
            ...oldState,
            focus: false,
            search: '',
            flat: flatDefaultOptions,
            highlighted: -1,
        }));

        if (ref.current) {
            ref.current.blur();
        }
    };

    const setFocus = newFocus => setState(oldState => ({ ...oldState, focus: newFocus }));
    const onClick = () => setFocus(!focus);
    const onFocus = () => setFocus(true);
    const onSelect = (val) => {
        const newOption = getOption(val, flat);
        const newOptions = getNewValue(newOption, option, multiple);
        const values = (multiple) ? newOptions.map(i => i.value) : newOptions.value;

        setState(oldState => ({
            ...oldState,
            addedOptions: (multiple) ? newOptions : [newOptions],
            value: values,
        }));

        onChange(
            values,
            newOptions,
        );
    };

    const onMouseDown = (e) => {
        if (!closeOnSelect || multiple) {
            e.preventDefault();

            if (multiple) {
                e.target.focus();
            }
        }

        onSelect(e.currentTarget.value);
    };
    const onKeyDown = (e) => {
        const { key } = e;

        if (key === 'ArrowDown' || key === 'ArrowUp') {
            e.preventDefault();

            setState(oldState => ({
                ...oldState,
                highlighted: highlightReducer(oldState.highlighted, {
                    key,
                    options: flat,
                }),
            }));
        }
    };

    const onKeyPress = ({ key }) => {
        if (key === 'Enter') {
            const newOption = flat[highlighted];

            if (newOption) {
                onSelect(newOption.value);

                if (!multiple && closeOnSelect) {
                    onBlur();
                }
            }
        }
    };

    const onKeyUp = ({ key }) => {
        if (key === 'Escape') {
            onBlur();
        }
    };

    const onSearch = ({ target }) => {
        const { value: inputVal } = target;
        const newState = { search: inputVal };

        let searchableOption = flatDefaultOptions;

        if (getOptions && inputVal.length) {
            newState.searching = true;

            searchableOption = getOptions(inputVal);
        }

        setState(oldState => ({ ...oldState, ...newState }));

        Promise.resolve(searchableOption)
            .then((foundOptions) => {
                let newOptions = foundOptions;

                if (inputVal.length) {
                    newOptions = doSearch(inputVal, foundOptions, fuse);
                }

                setState(oldState => ({
                    ...oldState,
                    flat: (newOptions === false) ? foundOptions : newOptions,
                    searching: false,
                }));
            })
            .catch(() => setState(oldState => ({
                ...oldState,
                flat: flatDefaultOptions,
                searching: false,
            })));
    };

    const valueProps = {
        tabIndex: '0',
        readOnly: !canSearch,
        onChange: (canSearch) ? onSearch : null,
        onMouseDown: onClick,
        onBlur,
        onFocus,
        onKeyPress,
        onKeyDown,
        onKeyUp,
        ref,
    };

    const optionProps = {
        tabIndex: '-1',
        onMouseDown,
        onKeyDown,
        onKeyPress,
        onBlur,
    };

    useEffect(() => {
        setState(oldState => ({ ...oldState, value: defaultValue }));
    }, [defaultValue]);

    useEffect(() => {
        setState(oldState => ({ ...oldState, flat: flatDefaultOptions }));
    }, [flatDefaultOptions]);

    return [
        {
            value: option,
            highlighted,
            options,
            disabled,
            displayValue,
            focus,
            search,
            searching,
        },
        valueProps,
        optionProps,
        newValue => setState(oldState => ({ ...oldState, value: newValue })),
    ];
}
