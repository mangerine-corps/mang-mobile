import { Edges } from 'react-native-safe-area-context';

const useEdges = () => {
  return {
    bottom: 'additive',
    left: 'additive',
    right: 'additive',
    top: 'off',
  } as Edges;
};

export default useEdges;
