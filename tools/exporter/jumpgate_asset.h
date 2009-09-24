#ifndef _H_JUMPGATEASSET_
#define _H_JUMPGATEASSET_

#include "asset.h"
#include <vector>

namespace Exporter {

class JumpgateAsset : public IAsset
{

public:

    JumpgateAsset();
    virtual ~JumpgateAsset();

    virtual float* GetVertexPositions(unsigned int meshIndex, unsigned int& count);
    virtual float* GetVertexIndices(unsigned int meshIndex, unsigned int& count);
    virtual float* GetTextureCoords(unsigned int meshIndex, unsigned int& count);

    virtual unsigned int GetMeshCount();

protected:
    
    std::vector<Mesh> m_meshes;
};

class MockJumpgateAsset : public JumpgateAsset
{
public:

    MockJumpgateAsset();
    virtual ~MockJumpgateAsset();
};

};

#endif
