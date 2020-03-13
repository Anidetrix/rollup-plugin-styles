export default (...regexps: RegExp[]): RegExp => new RegExp(regexps.map(re => re.source).join("|"));
