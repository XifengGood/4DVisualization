/// <reference types="@types/p5/global" />

import p5 from "p5";
declare global {
  /**
   *   loadSound() returns a new p5.SoundFile from a
   *   specified path. If called during preload(), the
   *   p5.SoundFile will be ready to play in time for
   *   setup() and draw(). If called outside of preload,
   *   the p5.SoundFile will not be ready immediately, so
   *   loadSound accepts a callback as the second
   *   parameter. Using a  local server is recommended
   *   when loading external files.
   *   @param path Path to the sound file, or an array
   *   with paths to soundfiles in multiple formats i.e.
   *   ['sound.ogg', 'sound.mp3']. Alternately, accepts
   *   an object: either from the HTML5 File API, or a
   *   p5.File.
   *   @param [successCallback] Name of a function to
   *   call once file loads
   *   @param [errorCallback] Name of a function to call
   *   if there is an error loading the file.
   *   @param [whileLoading] Name of a function to call
   *   while file is loading. This function will receive
   *   the percentage loaded so far, from 0.0 to 1.0.
   *   @return Returns a p5.SoundFile
   */
  function loadSound(
    path: string | any[],
    successCallback?: (...args: any[]) => any,
    errorCallback?: (...args: any[]) => any,
    whileLoading?: (...args: any[]) => any
  ): p5.SoundFile;
}
