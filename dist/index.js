"use strict";
// const fs = require('fs')
// const path = require('path')
// require('http').createServer((req, res) => {
//     if (req.url === '/') {
//       fs.createReadStream(
//         path.join(__dirname, '../index.html')
//       ).pipe(res);
//     } else {
//       res.end(req.url);
//     }
//   }).listen(8001, () => {
//     console.log('run at 8001');
//   });
Object.defineProperty(exports, "__esModule", { value: true });
const types = require("@babel/types");
function default_1() {
    return {
        visitor: {
            CallExpression(path, state) {
                let { callee } = path.node;
                if (!(types.isMemberExpression(callee) &&
                    types.isIdentifier(callee.object) &&
                    callee.object.name === 'React' &&
                    types.isIdentifier(callee.property) &&
                    callee.property.name === 'createElement')) {
                    return;
                }
            }
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map