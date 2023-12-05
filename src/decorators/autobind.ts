// autobind decorator
export function autobind(
  //"_"で定義されたが、使われてい無いparameterを表示
  _: any, 
  _2: string, 
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get () {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };
  return adjDescriptor;
}


