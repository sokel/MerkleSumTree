const MerkleSumTree = artifacts.require('./MerkleSumTree.sol');

const encodeProof = require('./helpers/MerkleSumTree/encodeProof');
const MerkleSumTreeJs = require('./helpers/MerkleSumTree/MerkleSumProof').MerkleSumTree;
const Leaf = require('./helpers/MerkleSumTree/MerkleSumProof').Leaf;

contract('MerkleSumTree', async function (accounts) {
    let tree;
    let owner = accounts[0];

    // Test case:
    // eslint-disable-next-line max-len
    // proof: 0x000000000000000005efbde2c3aee204a69b7696d4b10ff31137fe78e3946306284f806e2dfc68b80500000000000000000adc1f2cbadf3cf42e13fed7a5bc239fe828329bb0dd8ef456bed7ab94dec6c5980100000000000000b49d7cdd4e64c94f59c5d4c7db419624f7f097c889a5cbdc59980a7fb83733fac7
    // rootHash: 0x822d8b8f2bce6889851a8b3862e66ec578b8cf32439e16f26fd66617179008da
    // rootSize: 200
    // leafHash: 0x183a7d361ca1625fa85289cbdf578effaa4376f038587b9ab574e3fe80e5edc5
    // leafStart: 15
    // leafEnd: 20

    const leaves = [
        new Leaf([0, 4], null), // None means the leaf is empty.
        new Leaf([4, 10], 'tx1'),
        new Leaf([10, 15], null),
        new Leaf([15, 20], 'tx2'),
        new Leaf([20, 90], 'tx4'),
        new Leaf([90, 200], null),
    ];
    const treeJs = new MerkleSumTreeJs(leaves);
    const proof = treeJs.getProof(3);
    const leaf = leaves[3];
    const root = treeJs.getRoot();

    before(async function () {
        tree = await MerkleSumTree.new({ from: owner });
    });

    it('should be valid when providing the right proof', () => {
        treeJs.verifyProof(root, leaves[3], proof);
    });

    it('should be able to verify the proof provided by the JS merkle tree after encoding it', async () => {
        const encodedProof = encodeProof(proof);
        const verified = await tree.verify(
            encodedProof,
            root.hashed, root.size,
            leaf.getBucket().hashed, leaf.rng[0], leaf.rng[1],
        );
        assert.equal(verified, true, 'Wrong proof');
    });
});
