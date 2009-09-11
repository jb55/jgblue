#include <algorithm>
#include "asset.h"

namespace Exporter {

void Mesh::SetData(float* pData, unsigned int size, MeshType type) {
    std::vector<float>& vec = GetDataVector(type);

    vec.clear();
    vec.reserve(size);
    for(unsigned int i = 0; i < size; ++i) {
        vec.push_back(pData[i]);    
    }
}

std::vector<float>& Mesh::GetDataVector(MeshType type) {
    std::vector<float>* pVec;
    
    switch(type) {
    case Position:
        pVec = &m_v;
        break;
    case Vertex:
        pVec = &m_i;
        break;
    case Texture:
        pVec = &m_uv;
        break;
    }
   
    return *pVec;
}

float* Mesh::GetData(MeshType type) {
    return &GetDataVector(type).at(0);
}

unsigned int Mesh::GetSize(MeshType type) {
    return GetDataVector(type).size();
}

}
