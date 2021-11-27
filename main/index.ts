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


//导入 types和parser,traverse
// import * as babelCore from '@babel/core'
import * as parser from '@babel/parser'
import * as types from '@babel/types'

//其实思路就是把我们main/index.ts我们转换成dist/index.js文件以后的
export default function(){
   return {
    visitor : {
        CallExpression(path, state){
            let { callee } = path.node
            if (!(types.isMemberExpression(callee) &&
                    types.isIdentifier(callee.object) &&
                    callee.object.name === 'React' &&
                    types.isIdentifier(callee.property) &&
                    callee.property.name === 'createElement')) {
                return
            }
            // get the component type name and it's extra props options
            let [element, propsExpression] = path.node.arguments
            let elementType: string
            if (types.isStringLiteral(element)) {
                elementType = element.value
            } else if (types.isIdentifier(element)) {
                elementType = element.name
            }

            const options: Object = state.opts
            let extraProps: Object | undefined = options[elementType]

            if (!extraProps) {
                return
            }

            // build the extra props ObjectExpression
            let stringLiteral = JSON.stringify(extraProps)
            let extraPropsExpression = parser.parseExpression(stringLiteral)

            // if the default props is null(empty)
            if (types.isNullLiteral(propsExpression)) {
                path.node.arguments[1] = extraPropsExpression
            } else if (types.isObjectExpression(propsExpression)) {
                path.node.arguments[1] = types.objectExpression(
                    propsExpression.properties.concat(
                        (<types.ObjectExpression>extraPropsExpression).properties,
                    ),
                )
            }
        }
    }
    
   }
}

