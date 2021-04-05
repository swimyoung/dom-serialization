import { serialize, deserialize } from './index';
import cases from 'jest-in-case';

const removeTagSpaceInHTML = (str: string): string =>
  str
    .replace(/>[\s]+</g, '><')
    .replace(/>[\s]+/g, '>')
    .replace(/[\s]+</g, '<');

describe('serialize and deserialize', () => {
  it('should serialize dom and deserialize code again', () => {
    const dom = document.createElement('div');
    dom.appendChild(document.createTextNode('hello'));
    dom.appendChild(document.createTextNode('world'));
    expect(deserialize(serialize(dom))).toEqual(dom);
  });

  cases(
    'cases',
    ({ html }) => {
      const dom = document.createElement('div');
      dom.innerHTML = html;
      /* eslint-disable-next-line */
      expect(deserialize(serialize(dom))).toEqual(dom);
    },
    [
      {
        name: '1',
        html: `<a href='www.hello.com'>hello</a>`,
      },
      {
        name: '2',
        html: removeTagSpaceInHTML(`
        <table>
          <tbody>
            <tr>
              <td>A</td>
              <td>B</td>
            </tr>
            <tr>
              <td>C</td>
            </tr>
          </tbody>
        </table>
      `),
      },
      {
        name: '3',
        html: removeTagSpaceInHTML(`
        <div>
          <span>A</span>
          <span>B</span>
        </div>
        <div>
          <span>C</span>
          <span>D</span>
        </div>
        <span>E</span>
      `),
      },
      {
        name: '4',
        html: removeTagSpaceInHTML(`
        <div>
          <p>
            <b>
              <span style="color: rgb(100, 0, 0);">
                <u>A</u>
              </span>
            </b>
          </p>
        </div>
      `),
      },
      {
        name: '5',
        html: removeTagSpaceInHTML(`
        <div>
          <span>A</span>
          <!-- B -->
          <span>C</span>
        </div>
      `),
      },
      {
        name: '6',
        html: `A<img src='http://foo.com'/>B`,
      },
    ],
  );
});
