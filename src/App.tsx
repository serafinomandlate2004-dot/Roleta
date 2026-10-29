/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, Check, Copy } from 'lucide-react';
import { soundEffects } from './utils/audio';

export default function App() {
  const [tentativas, setTentativas] = useState<number>(0);
  const [isGirarDisabled, setIsGirarDisabled] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [transitionDuration, setTransitionDuration] = useState<number>(0);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Countdown timer initialized to 2 minutes 39 seconds (159 seconds)
  const [secondsLeft, setSecondsLeft] = useState<number>(159);

  const roletaRef = useRef<HTMLImageElement | null>(null);

  // Countdown timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 179));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  // Trigger confetti burst
  const triggerConfetti = () => {
    const duration = 3500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#f39c12', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6', '#f1c40f'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#f39c12', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6', '#f1c40f'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleGirar = () => {
    if (isGirarDisabled || tentativas >= 2) return;

    const nextTentativa = tentativas + 1;
    setTentativas(nextTentativa);
    setIsGirarDisabled(true);

    let anguloFinal = 0;
    let tempoGiro = 0;

    if (nextTentativa === 1) {
      anguloFinal = 285 + 16 * 360; // 6045deg
      tempoGiro = 9;
    } else {
      anguloFinal = 320 + 24 * 360; // 8960deg
      tempoGiro = 8;
    }

    setTransitionDuration(tempoGiro);
    setRotation(anguloFinal);

    // Audio spinning sound synthesis
    soundEffects.playSpinningSound(tempoGiro);

    setTimeout(() => {
      soundEffects.stopSpinningSound();
      setTimeout(() => {
        setPopupVisible(true);
        if (nextTentativa === 2) {
          soundEffects.playCelebration();
          triggerConfetti();
        }
      }, 500);
    }, tempoGiro * 1000);
  };

  const fecharPopUpEGirar = () => {
    setPopupVisible(false);
    setIsGirarDisabled(false);
    // Automatically trigger 2nd spin as in original implementation
    setTimeout(() => {
      handleGirar();
    }, 100);
  };

  const handleCopyText = async () => {
    const shareText =
      '🚀 Acabei de girar uma roleta e ganhei um prêmio! Você também pode ganhar até 10.000 MT grátis. Entra aqui: https://roleta-da-sorte-zf.vercel.app';
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.getElementById('shareText') as HTMLInputElement;
      if (input) {
        input.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Poppins'] flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Floating Action Buttons */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
        <a
          href="/roleta-da-sorte.zip"
          download="roleta-da-sorte.zip"
          title="Baixar Projeto Completo (.ZIP) para Lovable / GitHub"
          className="bg-neutral-900/90 hover:bg-neutral-800 text-amber-400 hover:text-amber-300 text-xs font-semibold px-3 py-2 rounded-full border border-amber-500/40 backdrop-blur-sm transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
        >
          <span>📥</span>
          <span className="hidden sm:inline">Baixar Projeto (.ZIP)</span>
          <span className="sm:hidden">ZIP</span>
        </a>

        <button
          onClick={toggleMute}
          title={isMuted ? 'Ativar som' : 'Desativar som'}
          className="bg-neutral-900/80 hover:bg-neutral-800 text-white/80 hover:text-white p-2 rounded-full border border-neutral-700/60 backdrop-blur-sm transition-all shadow-lg cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
        </button>
      </div>

      {/* SECTION 1: Top Announcement Bar */}
      <section className="bg-black border-b border-neutral-800 py-3 px-4 text-center">
        <p className="text-white text-xs sm:text-sm font-medium tracking-wide">
          Tens 2 tentativas grátis para girar a roleta. Não custa nada, clique no botao girar!
        </p>
      </section>

      {/* SECTION 2: Roulette Main Stage */}
      <section className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <span>🎯</span> Tente a sua sorte! <span>🎯</span>
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base mt-2 font-normal">
            Clique no botão e gire a roleta para ganhar prêmios!
          </p>
        </div>

        {/* Wheel Container with Pointer */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="relative w-[300px] h-[300px] sm:w-[330px] sm:h-[330px]">
            {/* Roulette Wheel Image */}
            <img
              ref={roletaRef}
              src="/images/cQc9WWa.png"
              alt="Roleta da Sorte"
              id="roleta"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: transitionDuration > 0
                  ? `transform ${transitionDuration}s cubic-bezier(0.1, 0.8, 0.3, 1)`
                  : 'none',
              }}
              className="w-full h-full object-cover rounded-full shadow-[0_0_35px_rgba(243,156,18,0.35)] select-none pointer-events-none"
            />

            {/* Red Indicator Flapper Arrow pointing at wheel from right side */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '-20px',
                transform: 'translateY(-50%) rotate(180deg)',
                width: 0,
                height: 0,
                borderTop: '15px solid transparent',
                borderBottom: '15px solid transparent',
                borderLeft: '30px solid #e74c3c',
                filter: 'drop-shadow(2px 0 4px rgba(0,0,0,0.5))',
                zIndex: 20,
              }}
            />

            {/* Center golden hub cap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border-2 border-amber-100 shadow-md pointer-events-none" />
          </div>
        </div>

        {/* Spin Button */}
        <div className="text-center mt-6">
          <button
            id="girarBtn"
            onClick={handleGirar}
            disabled={isGirarDisabled || tentativas >= 2}
            className={`px-8 py-3.5 text-lg font-bold text-white rounded-xl transition-all shadow-lg active:scale-95 ${
              isGirarDisabled || tentativas >= 2
                ? 'bg-neutral-600 opacity-60 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 heartbeat-btn glow-btn cursor-pointer'
            }`}
          >
            🎲 GIRAR
          </button>

          {tentativas > 0 && tentativas < 2 && (
            <p className="text-amber-400 text-xs sm:text-sm mt-3 font-medium">
              1 tentativa restante!
            </p>
          )}
        </div>
      </section>

      {/* POPUP MODAL */}
      {popupVisible && (
        <div
          id="popup"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm transition-opacity"
        >
          <div className="bg-white text-neutral-800 p-6 sm:p-8 rounded-2xl w-full max-w-[450px] text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-neutral-100 animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-4">
              🎉 Resultado 🎉
            </h3>

            {tentativas === 1 ? (
              <div>
                <p className="text-base sm:text-lg text-neutral-700 leading-relaxed my-5">
                  ❌ Não foi dessa vez!
                  <br />
                  Você tem mais 1 chance.
                  <br />
                  Clique no botão abaixo e gire novamente!
                </p>

                <button
                  id="girarNovamente"
                  onClick={fecharPopUpEGirar}
                  className="heartbeat-btn mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-7 py-3.5 rounded-lg text-base font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  🔁 Girar Novamente
                </button>
              </div>
            ) : (
              <div>
                <div className="text-left text-sm sm:text-base text-neutral-700 leading-relaxed my-4 space-y-3">
                  <p className="text-center text-xl sm:text-2xl font-black text-amber-600">
                    🤑 Parabéns! Você ganhou <b className="text-neutral-900">5.000 Meticais!</b>
                  </p>

                  <p className="text-neutral-700 text-center">
                    Para receber, registre-se na plataforma clicando no botão abaixo e{' '}
                    <b>deposite 5 ou 20 Meticais para que possamos confirmar seu número e enviar o valor.</b>
                  </p>

                  <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded text-xs sm:text-sm text-neutral-800">
                    <p className="font-bold text-amber-900 mb-1">
                      ⚠️ O prêmio só será entregue para quem criar uma nova conta na plataforma.
                    </p>
                    <p className="text-neutral-600">
                      Se já possui uma conta, é necessário criar uma nova para receber o valor na sua carteira móvel!
                    </p>
                  </div>
                </div>

                <a
                  id="popupButton"
                  href="https://tracking.olabet.co.mz/C.ashx?btag=a_2950b_7c_&affid=2858&siteid=2950&adid=7&c="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="heartbeat-btn mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-extrabold transition-all shadow-lg active:scale-95 text-center uppercase tracking-wide"
                >
                  💰 REGISTRE-SE AGORA!
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3 & 4: Countdown Urgency Box */}
      <section className="bg-black py-6 px-4 text-center">
        <p className="text-white text-base sm:text-lg font-medium italic mb-5">
          ⏳ Você tem 01:59 para girar e garantir sua chance gratuita!
        </p>

        {/* 4 Countdown Digital Blocks */}
        <div className="flex justify-center items-center gap-2 sm:gap-4 max-w-sm mx-auto">
          {/* Days */}
          <div className="bg-[#f5f5f5] text-neutral-900 w-16 sm:w-20 py-2.5 rounded-lg shadow-sm text-center">
            <span className="block text-xl sm:text-2xl font-extrabold tracking-tight">00</span>
            <span className="text-[10px] sm:text-xs text-neutral-500 uppercase font-semibold">Dias</span>
          </div>

          {/* Hours */}
          <div className="bg-[#f5f5f5] text-neutral-900 w-16 sm:w-20 py-2.5 rounded-lg shadow-sm text-center">
            <span className="block text-xl sm:text-2xl font-extrabold tracking-tight">00</span>
            <span className="text-[10px] sm:text-xs text-neutral-500 uppercase font-semibold">Horas</span>
          </div>

          {/* Minutes */}
          <div className="bg-[#f5f5f5] text-neutral-900 w-16 sm:w-20 py-2.5 rounded-lg shadow-sm text-center">
            <span className="block text-xl sm:text-2xl font-extrabold tracking-tight text-orange-600">
              {formattedMinutes}
            </span>
            <span className="text-[10px] sm:text-xs text-neutral-500 uppercase font-semibold">Minutos</span>
          </div>

          {/* Seconds */}
          <div className="bg-[#f5f5f5] text-neutral-900 w-16 sm:w-20 py-2.5 rounded-lg shadow-sm text-center">
            <span className="block text-xl sm:text-2xl font-extrabold tracking-tight text-orange-600">
              {formattedSeconds}
            </span>
            <span className="text-[10px] sm:text-xs text-neutral-500 uppercase font-semibold">Segundos</span>
          </div>
        </div>
      </section>

      {/* SECTION 5 & 6: Call To Action Instructions (Light Gray Band) */}
      <section className="bg-[#f5f5f5] text-neutral-900 py-8 px-4 my-6">
        <div className="max-w-xl mx-auto text-center space-y-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            Chegou sua vez de ganhar!
          </h2>
          <p className="text-neutral-700 text-sm sm:text-base">
            Para começar, basta apertar o botão dourado escrito{' '}
            <span className="font-extrabold text-orange-600">GIRAR</span>!
          </p>
          <div className="pt-2">
            <p className="text-neutral-800 text-sm sm:text-base font-medium flex items-center justify-center gap-1.5">
              <span>💡</span> Você tem 2 tentativas totalmente grátis!
            </p>
            <p className="text-neutral-600 text-xs sm:text-sm mt-1">
              A roleta está cheia de prêmios esperando por você!
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7 & 8: Prizes List (Black Section) */}
      <section className="bg-black py-8 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-extrabold text-center text-white mb-6 flex items-center justify-center gap-2">
            <span>🎁</span> Prêmios da Roleta da Sorte
          </h2>

          <div className="space-y-3 text-sm sm:text-base">
            <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-xl p-3.5 flex items-center gap-3">
              <span className="text-green-400 font-bold">✅</span>
              <div>
                <strong className="text-white font-bold">10 Meticais</strong>
                <span className="text-neutral-300"> – Comece com sorte!</span>
              </div>
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-xl p-3.5 flex items-center gap-3">
              <span className="text-green-400 font-bold">✅</span>
              <div>
                <strong className="text-white font-bold">100 Meticais</strong>
                <span className="text-neutral-300"> – Já dá pra comemorar!</span>
              </div>
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-xl p-3.5 flex items-center gap-3">
              <span className="text-green-400 font-bold">✅</span>
              <div>
                <strong className="text-white font-bold">500 Meticais</strong>
                <span className="text-neutral-300"> – Subindo o nível!</span>
              </div>
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-xl p-3.5 flex items-center gap-3">
              <span className="text-green-400 font-bold">✅</span>
              <div>
                <strong className="text-white font-bold">1.000 Meticais</strong>
                <span className="text-neutral-300"> – Agora sim!</span>
              </div>
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-xl p-3.5 flex items-center gap-3 bg-gradient-to-r from-amber-950/40 to-neutral-900/80 border-amber-600/30">
              <span className="text-green-400 font-bold">✅</span>
              <div>
                <strong className="text-amber-400 font-bold">5.000 Meticais</strong>
                <span className="text-neutral-200"> – Sorte grande!</span>
              </div>
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-xl p-3.5 flex items-center gap-3 bg-gradient-to-r from-yellow-950/50 to-neutral-900/80 border-yellow-500/40">
              <span className="text-green-400 font-bold">✅</span>
              <div>
                <strong className="text-yellow-400 font-bold">10.000 Meticais</strong>
                <span className="text-neutral-200"> – O prêmio dos sonhos! 💸</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: Viral Share Box */}
      <section className="bg-black py-8 px-4">
        <div className="max-w-[600px] mx-auto p-5 sm:p-6 rounded-2xl bg-[#fff8e1] text-neutral-800 shadow-[0_4px_16px_rgba(0,0,0,0.25)] border border-amber-100">
          <h2 className="text-[#d35400] text-xl sm:text-2xl font-extrabold text-center mb-3">
            🔁 GANHE MAIS GIROS GRÁTIS!
          </h2>

          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed text-center mb-5">
            Compartilhe o site{' '}
            <strong className="text-sky-600">
              https://roleta-da-sorte-zf.vercel.app
            </strong>{' '}
            com seus amigos e familiares por WhatsApp, SMS, Telegram, ou redes sociais e ganhe{' '}
            <strong className="text-neutral-900">+1 giro grátis</strong> a cada pessoa!
          </p>

          <div className="bg-white border border-neutral-300 p-4 rounded-xl mb-4 shadow-inner">
            <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-2">
              💬 Frase pronta para enviar:
            </p>
            <input
              id="shareText"
              type="text"
              readOnly
              value="🚀 Acabei de girar uma roleta e ganhei um prêmio! Você também pode ganhar até 10.000 MT grátis. Entra aqui: https://roleta-da-sorte-zf.vercel.app"
              className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs sm:text-sm bg-neutral-50 text-neutral-800 focus:outline-none"
            />
            <button
              onClick={handleCopyText}
              className="mt-3 w-full bg-[#f39c12] hover:bg-[#e67e22] text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Mensagem copiada! Cole no WhatsApp ou SMS</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-white" />
                  <span>📋 Copiar mensagem</span>
                </>
              )}
            </button>
          </div>

          <a
            href="https://api.whatsapp.com/send?text=%F0%9F%9A%80%20Acabei%20de%20girar%20uma%20roleta%20e%20ganhei%20um%20pr%C3%AAmio!%20Voc%C3%AA%20tamb%C3%A9m%20pode%20ganhar%20at%C3%A9%2010.000%20MT%20gr%C3%A1tis.%20Entra%20aqui:%20https://roleta-da-sorte-zf.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-xl text-center text-sm sm:text-base font-bold transition-all shadow-md active:scale-98 cursor-pointer"
          >
            📲 Compartilhar no WhatsApp
          </a>
        </div>
      </section>

      {/* SECTION 10 & 11: Footer / Terms of Use & Legal */}
      <footer className="bg-black border-t border-neutral-900 py-10 px-4 mt-auto">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div>
            <h3 className="text-white font-bold text-sm sm:text-base">
              Termos de Uso e Direitos Reservados
            </h3>
            <p className="text-neutral-400 text-xs mt-1 italic">
              © 2025 Roleta da Sorte – Todos os direitos reservados.
            </p>
          </div>

          <p className="text-neutral-400 text-[11px] sm:text-xs leading-relaxed text-justify sm:text-center">
            A presente simulação interativa tem como principal finalidade o estímulo à participação em ofertas promocionais vinculadas a plataformas externas. Os valores exibidos na roleta não representam prêmios efetivamente creditáveis, estando sua disponibilização condicionada à conclusão de processos de adesão e validação por parte de terceiros. A exibição de montantes possui caráter meramente demonstrativo, sem constituição de obrigação por parte deste domínio ou seus parceiros comerciais.
          </p>

          <p className="text-neutral-400 text-[10px] sm:text-[11px]">
            Este conteúdo está protegido pelas normas de propriedade intelectual. A utilização indevida está sujeita às penalidades legais aplicáveis.
          </p>

          <div className="pt-4 border-t border-neutral-900/80">
            <a
              href="/roleta-da-sorte.zip"
              download="roleta-da-sorte.zip"
              className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-amber-400 text-xs px-4 py-2 rounded-lg border border-neutral-800 transition-colors"
            >
              <span>📦</span>
              <span>Baixar código-fonte do projeto (.ZIP)</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
