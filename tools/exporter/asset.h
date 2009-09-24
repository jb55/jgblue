#ifndef _H_ASSET_
#define _H_ASSET_

#include <vector>

namespace Exporter {

class Mesh
{
public:
    enum MeshType {
        Position,
        Vertex,
        Texture
    };

    void SetData(float* pData, unsigned int size, MeshType type);
    float* GetData(MeshType type);
    unsigned int GetSize(MeshType type);

private:

    std::vector<float>& GetDataVector(MeshType type);

    std::vector<float> m_v;
    std::vector<float> m_i;
    std::vector<float> m_uv;

};

class IAsset
{
public:
    virtual float* GetVertexPositions(unsigned int meshIndex, unsigned int& count) = 0;
    virtual float* GetVertexIndices(unsigned int meshIndex, unsigned int& count) = 0;
    virtual float* GetTextureCoords(unsigned int meshIndex, unsigned int& count) = 0;

    virtual unsigned int GetMeshCount() = 0;
};

}

#endif
