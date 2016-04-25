/* eslint-disable no-eval */
import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import IntlTelInput from '../src/containers/IntlTelInputApp';
import TelInput from '../src/components/TelInput';
import { assert } from 'chai';

describe('TelInput', () => {
  let renderedComponent;
  let inputComponent;

  beforeEach('Render element', () => {
    renderedComponent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        fieldId={'telephone-id'}
        defaultCountry={'tw'}
        value={'0999 123 456'}
        loadUtilsScript
      />
    );

    inputComponent = ReactTestUtils.findRenderedComponentWithType(
      renderedComponent,
      TelInput
    );
  });

  it('Set fieldName as "telephone"', () => {
    assert(inputComponent.props.fieldName === 'telephone');
  });

  it('Set fieldId as "telephone-id"', () => {
    assert(inputComponent.props.fieldId === 'telephone-id');
  });

  it('onPhoneNumberChange without utilsScript', () => {
    let expected = '';
    const onPhoneNumberChange = (isValid, newNumber, countryData, formatted) => {
      expected = `${isValid},${newNumber},${countryData.iso2},${formatted}`;
    };

    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
        onPhoneNumberChange={onPhoneNumberChange}
      />
    );

    const input = ReactTestUtils.findRenderedComponentWithType(
      parent,
      TelInput
    );

    ReactTestUtils.Simulate.change(findDOMNode(input), { target: { value: '+886911222333' } });
    assert(expected === 'false,+886911222333,tw,false');
  });

  it('Set value as "0999 123 456"', () => {
    assert(inputComponent.props.value === '0999 123 456');
  });

  it('Set className', () => {
    assert(findDOMNode(inputComponent).className === 'form-control phoneNumber');
  });

  it('Change value', () => {
    findDOMNode(inputComponent).value = '12345';
    ReactTestUtils.Simulate.change(findDOMNode(inputComponent));
    assert(inputComponent.props.value === '12345');
  });

  it('Preferred countries', () => {
    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'zz'}
        preferredCountries={['kr', 'jp', 'tw']}
        loadUtilsScript
      />
    );

    assert(parent.state.countryCode === 'kr');
  });

  it('Invalid default country', () => {
    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        preferredCountries={[]}
        defaultCountry={'zz'}
        loadUtilsScript
      />
    );

    assert(parent.state.countryCode === 'af');
  });

  it('Invalid key', () => {
    ReactTestUtils.Simulate.keyPress(findDOMNode(inputComponent), {
      key: 'a',
      keyCode: 65,
      which: 65,
    });
    assert(findDOMNode(inputComponent).classList.contains('iti-invalid-key'));
  });

  it('handleKeyUp', () => {
    const len = findDOMNode(inputComponent).value.length;
    findDOMNode(inputComponent).focus();
    findDOMNode(inputComponent).setSelectionRange(len, len);
    ReactTestUtils.Simulate.keyUp(findDOMNode(inputComponent), {
      key: 'Backspace',
      keyCode: 8,
      which: 8,
    });
    ReactTestUtils.Simulate.change(findDOMNode(inputComponent), {
      target: { value: '0999 123 45' },
    });
    assert(findDOMNode(inputComponent).value === '0999 123 45');
  });

  it('ensurePlus', () => {
    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        nationalMode={false}
        defaultCountry={'tw'}
        value={'+886999111222345'}
        loadUtilsScript
      />
    );

    const input = ReactTestUtils.findRenderedComponentWithType(
      parent,
      TelInput
    );

    const len = findDOMNode(input).value.length;
    findDOMNode(input).focus();
    findDOMNode(input).setSelectionRange(len, len);
    const bspaceKey = {
      key: 'Backspace',
      keyCode: 8,
      which: 8,
    };
    ReactTestUtils.Simulate.keyUp(findDOMNode(input), bspaceKey);
    ReactTestUtils.Simulate.keyUp(findDOMNode(input), bspaceKey);
    ReactTestUtils.Simulate.keyUp(findDOMNode(input), bspaceKey);
    ReactTestUtils.Simulate.change(findDOMNode(input), {
      target: { value: '+886 999 111 222' },
    });
    assert(parent.state.telInput.value === '+886 999 111 222');
  });

  it('Disabled nationalMode and input phone number', () => {
    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        nationalMode={false}
        defaultCountry={'tw'}
        loadUtilsScript
      />
    );

    const input = ReactTestUtils.findRenderedComponentWithType(
      parent,
      TelInput
    );

    ReactTestUtils.Simulate.change(findDOMNode(input), { target: { value: '+886901234567' } });
    assert(findDOMNode(input).value === '+886901234567');
  });

  it('Change props value', () => {
    renderedComponent.componentWillReceiveProps({
      value: '+886912345678',
    });
    assert(findDOMNode(inputComponent).value === '0912 345 678');
  });

  it('onPhoneNumberChange', () => {
    let expected = '';
    const onPhoneNumberChange = (isValid, newNumber, countryData, formatted) => {
      expected = `${isValid},${newNumber},${countryData.iso2},${formatted}`;
    };

    const parent = ReactTestUtils.renderIntoDocument(
      <IntlTelInput css={['intl-tel-input', 'form-control phoneNumber']}
        fieldName={'telephone'}
        defaultCountry={'tw'}
        loadUtilsScript
        onPhoneNumberChange={onPhoneNumberChange}
      />
    );

    const input = ReactTestUtils.findRenderedComponentWithType(
      parent,
      TelInput
    );

    ReactTestUtils.Simulate.change(findDOMNode(input), { target: { value: '+886911222333' } });
    assert(expected === 'true,+886911222333,tw,+886911222333');
  });
});
