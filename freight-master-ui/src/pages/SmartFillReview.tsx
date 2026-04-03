import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ConfidenceBadge } from "@/components/shared/StatusBadge";
import { extractedFields, type ExtractedField } from "@/data/mockData";
import { CheckCircle, XCircle, Pencil, FileText, AlertTriangle, Eye } from "lucide-react";

export default function SmartFillReview() {
  const [selectedField, setSelectedField] = useState<ExtractedField | null>(null);

  const categories = Array.from(new Set(extractedFields.map((f) => f.category)));

  const getStatusIcon = (status: ExtractedField["status"]) => {
    switch (status) {
      case "Approved": return <CheckCircle className="h-3.5 w-3.5 text-success" />;
      case "Corrected": return <Pencil className="h-3.5 w-3.5 text-primary" />;
      case "Rejected": return <XCircle className="h-3.5 w-3.5 text-destructive" />;
      default: return <Eye className="h-3.5 w-3.5 text-warning" />;
    }
  };

  return (
    <AppLayout title="SmartFill Review" subtitle="COAL-RB-IND-0041">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
        {/* Left Panel: Document Viewer */}
        <div className="bg-card rounded-md border shadow-sm flex flex-col">
          <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Document Viewer</h3>
            <div className="flex ml-auto gap-1">
              {["Bill of Lading", "COA", "Draft Survey"].map((doc) => (
                <button
                  key={doc}
                  className="text-[10px] px-2.5 py-1 rounded border bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                >
                  {doc}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center bg-muted/30 m-3 rounded border-2 border-dashed border-border">
            <div className="text-center p-8">
              <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">Bill of Lading</p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">COAL-OREVOY-2026-0041</p>
              <p className="text-xs text-muted-foreground mt-3">PDF viewer would render here</p>
              {selectedField && (
                <div className="mt-4 p-3 bg-primary/5 rounded border border-primary/20 text-left">
                  <p className="text-[10px] uppercase text-primary font-semibold tracking-wider">Source Location</p>
                  <p className="text-xs text-foreground mt-1">
                    <span className="font-medium">{selectedField.sourceDocument}</span> → {selectedField.sourceSection}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Extracted Fields */}
        <div className="bg-card rounded-md border shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
            <h3 className="text-sm font-semibold text-foreground">Extracted Fields</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{extractedFields.filter((f) => f.status === "Approved").length}/{extractedFields.length} approved</span>
              <span className="flex items-center gap-1 text-warning">
                <AlertTriangle className="h-3 w-3" />
                {extractedFields.filter((f) => f.discrepancy).length} flagged
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {categories.map((cat) => (
              <div key={cat}>
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</h4>
                <div className="space-y-1.5">
                  {extractedFields.filter((f) => f.category === cat).map((field) => (
                    <button
                      key={field.id}
                      onClick={() => setSelectedField(field)}
                      className={`w-full text-left px-3 py-2.5 rounded border transition-colors ${
                        selectedField?.id === field.id
                          ? "border-primary bg-primary/5"
                          : field.discrepancy
                          ? "border-warning/30 bg-warning/5 hover:border-warning/50"
                          : "border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(field.status)}
                          <span className="text-xs font-medium text-foreground">{field.fieldName}</span>
                        </div>
                        <ConfidenceBadge confidence={field.confidence} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono text-foreground">{field.extractedValue}</span>
                        <span className="text-[10px] text-muted-foreground">{field.sourceDocument}</span>
                      </div>
                      {field.discrepancy && (
                        <div className="flex items-start gap-1 mt-1.5 text-[10px] text-destructive">
                          <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                          <span>{field.discrepancy}</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="border-t px-4 py-3 flex items-center justify-between shrink-0 bg-muted/20">
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1.5 rounded bg-success text-success-foreground font-medium hover:opacity-90 transition-opacity">
                Approve Selected
              </button>
              <button className="text-xs px-3 py-1.5 rounded bg-secondary text-secondary-foreground border font-medium hover:bg-accent transition-colors">
                Correct
              </button>
              <button className="text-xs px-3 py-1.5 rounded border text-destructive font-medium hover:bg-destructive/5 transition-colors">
                Reject
              </button>
            </div>
            <button className="text-xs px-3 py-1.5 rounded bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
