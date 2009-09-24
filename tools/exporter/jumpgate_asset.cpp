#include "jumpgate_asset.h"

namespace Exporter {


MockJumpgateAsset::MockJumpgateAsset() {
    float pData[] = { 1.0, 2.0, 3.0, 4.0 };
    m_meshes.push_back(Mesh());

    m_meshes.at(0).SetData(pData, 4, Mesh::Position);
    m_meshes.at(0).SetData(pData, 4, Mesh::Vertex);
    m_meshes.at(0).SetData(pData, 4, Mesh::Texture);
}

MockJumpgateAsset::~MockJumpgateAsset() {
}

JumpgateAsset::JumpgateAsset() {
}

JumpgateAsset::~JumpgateAsset() {
}

float* JumpgateAsset::GetVertexPositions(unsigned int meshIndex, unsigned int& count) {
    Mesh& mesh = m_meshes.at(meshIndex);
    count = mesh.GetSize(Mesh::Position);
    return mesh.GetData(Mesh::Position);
}


float* JumpgateAsset::GetVertexIndices(unsigned int meshIndex, unsigned int& count) {
    Mesh& mesh = m_meshes.at(meshIndex);
    count = mesh.GetSize(Mesh::Vertex);
    return mesh.GetData(Mesh::Vertex);
}


float* JumpgateAsset::GetTextureCoords(unsigned int meshIndex, unsigned int& count) {
    Mesh& mesh = m_meshes.at(meshIndex);
    count = mesh.GetSize(Mesh::Texture);
    return mesh.GetData(Mesh::Texture);
}

unsigned int JumpgateAsset::GetMeshCount() {
    return m_meshes.size();
}

}
