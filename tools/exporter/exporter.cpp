#include <stdio.h>
#include "FCollada.h"
#include "FCDVersion.h"
#include "FCDocument.h"

int main(void) {
    FCollada::Initialize();

    FCDocument* pDoc;

    pDoc = FCollada::NewDocument();
    FCDVersion ver = pDoc->GetVersion();

    printf("FCollada Version: %u\n", FCollada::GetVersion());
    printf("FCDocument Version: %d.%d r%d\n", ver.major, ver.minor, ver.revision);
    printf("exporter ver. 0\n\n");

    wchar_t* filename = L"test.dae";

    if ( !FCollada::SaveDocument(pDoc, filename) )
        printf("Unsuccessful save.\n");
    else
        printf("Saved %ls\n", filename);

    FCollada::Release();
    return 0;
}
