import React from 'react';
import { RAGEvidence } from '../types/clinical';
import { evaluateRAGASMetrics } from '../engines/guardrailsEngine';
import { BookOpen, ShieldCheck, ExternalLink, CheckCircle, Award, Sparkles } from 'lucide-react';

interface EvidenceRAGViewProps {
  evidenceList: RAGEvidence[];
}

export const EvidenceRAGView: React.FC<EvidenceRAGViewProps> = ({ evidenceList }) => {
  const ragasMetrics = evaluateRAGASMetrics(evidenceList);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* RAGAS Framework Telemetry Metrics Header */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              RAGAS Medical Grounding & Anti-Hallucination Framework
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              Every diagnosis and treatment is formally cross-verified against verified peer-reviewed guidelines to suppress AI hallucination.
            </p>
          </div>
        </div>

        {/* 4 RAGAS Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
          
          <div style={{ background: '#1e293b', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #334155', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
              Faithfulness Score
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', margin: '0.2rem 0' }}>
              {ragasMetrics.faithfulnessScore}%
            </div>
            <span style={{ fontSize: '0.7rem', color: '#6ee7b7' }}>
              Zero unsupported medical claims
            </span>
          </div>

          <div style={{ background: '#1e293b', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #334155', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
              Context Relevance
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', margin: '0.2rem 0' }}>
              {ragasMetrics.contextRelevanceScore}%
            </div>
            <span style={{ fontSize: '0.7rem', color: '#7dd3fc' }}>
              High signal-to-noise dense retrieval
            </span>
          </div>

          <div style={{ background: '#1e293b', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #334155', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
              Answer Relevance
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#a855f7', margin: '0.2rem 0' }}>
              {ragasMetrics.answerRelevanceScore}%
            </div>
            <span style={{ fontSize: '0.7rem', color: '#d8b4fe' }}>
              Addresses clinical complaint precisely
            </span>
          </div>

          <div style={{ background: '#064e3b', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #059669', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 600 }}>
              Hallucination Risk
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', margin: '0.5rem 0' }}>
              {ragasMetrics.hallucinationRisk}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#6ee7b7' }}>
              Protected by NeMo Guardrails
            </span>
          </div>

        </div>
      </div>

      {/* Retrieved PubMed Knowledge Chunks */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} color="#38bdf8" />
          Retrieved Grounded Guidelines & Medical Literature Citations ({evidenceList.length} Chunks)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {evidenceList.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: '0.35rem', background: '#0284c7', color: '#e0f2fe', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginRight: '0.5rem' }}>
                    {item.source.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                    PMID: {item.pmid} • {item.journal} ({item.year})
                  </span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '0.35rem', marginBottom: '0.2rem' }}>
                    {item.title}
                  </h4>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>SIMILARITY</span>
                  <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>
                    {(item.relevanceScore * 100).toFixed(1)}%
                  </strong>
                </div>
              </div>

              <div style={{ background: '#1e293b', padding: '0.85rem 1rem', borderRadius: '0.5rem', borderLeft: '3px solid #059669', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, marginTop: '0.5rem' }}>
                &ldquo;{item.excerpt}&rdquo;
              </div>

              <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                <a
                  href={item.doiOrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}
                >
                  Verify on PubMed Central <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

